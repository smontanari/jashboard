require 'spec_helper'
require 'json_spec'
require 'stringio'
require 'plugins/vcs/adapters/git_adapter'

module Jashboard
  module Plugin
    module Vcs
      StubCommit = Struct.new(:oid, :author, :time, :message)
      describe GitAdapter do
        let(:subject) {Object.new.extend GitAdapter}

        describe("VCS runtime info retrieval") do
          let(:repo) {double('repository')}
          let(:walker) {double('walker')}
          let(:branch) {double('branch')}

          before(:each) do
            Rugged::Repository.should_receive(:discover).with("test-basedir").and_return(repo)
          end

          context 'non empty repository' do
            shared_examples 'retrieving commits from branch' do |input_branch_name, actual_branch_name|
              commits = [
                StubCommit.new("test-commit_1", {name: "test-committer_1", email: "committer1@test.com"}, "2012-09-10 17:28:34 +1000", "test-message1"),
                StubCommit.new("test-commit_2", {name: "test-committer_2", email: "committer2@test.com"}, "2012-09-13 11:56:19 +1000", "test-message2")
              ]

              before(:each) do
                repo.stub(:branches).and_return({actual_branch_name => branch})
                branch.stub(:target_id).and_return('test_sha')
                Rugged::Walker.should_receive(:new).with(repo).and_return(walker)
                walker.should_receive(:sorting).with(Rugged::SORT_DATE)
                walker.should_receive(:push).with('test_sha')
                walker.should_receive(:first).with(commits.count).and_return(commits)
              end

              it("retrieves the given number of commits from the #{actual_branch_name} branch") do
                configuration = {
                  working_directory: "test-basedir",
                  history_length: commits.count,
                  branch: input_branch_name,
                  type: "git"
                }.to_struct

                runtime_info = subject.get_git_runtime_info(configuration)
                runtime_info.count.should == commits.count
                commits.each_with_index do |commit, index|
                  runtime_info[index].revision_id.should == commit.oid
                  runtime_info[index].date.should == commit.time
                  runtime_info[index].author.should == commit.author[:name]
                  runtime_info[index].email.should == commit.author[:email]
                  runtime_info[index].message.should == commit.message
                end
              end
            end

            before(:each) do
              repo.stub(:empty? => false)
            end

            context 'no branch specified' do
              include_examples 'retrieving commits from branch', nil, 'master'
            end

            context 'empty branch name' do
              include_examples 'retrieving commits from branch', '', 'master'
            end

            context 'non master branch' do
              include_examples 'retrieving commits from branch', 'test-branch', 'test-branch'
            end
          end
        end
      end
    end
  end
end
