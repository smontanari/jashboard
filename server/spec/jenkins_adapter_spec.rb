require 'spec_helper'
require 'open-uri'
require 'stringio'
require 'service/adapters/ci/jenkins_adapter'
require 'model/ciserver_settings'

module Jashboard
  module CIServer
    describe JenkinsAdapter do
      before(:each) do
        @uri = double
        @uri.stub(:open) do
          File.new("spec/resources/jenkins-lastbuild-success-response.xml")
        end
        URI.stub(:parse).and_return(@uri)
      end

      it("should invoke the correct url to retrieve last build information") do
        URI.should_receive(:parse).with("http://test.host:1234/job/test.build/lastSuccessfulBuild/api/xml")

        subject.fetch_build_info(JenkinsServerSettings.new("test.host", 1234, "test.build"))
      end
      it("should use parse the xml response to retrieve last build information") do
        runtime_info = subject.fetch_build_info(JenkinsServerSettings.new("test.host", 1234, "test.build"))
        runtime_info.last_build_time.should == "05-11-2012 09:35:08"
        runtime_info.duration.should == 25
        runtime_info.success.should == true
      end
      it("should return current build status as 0 when requesting next build info returns an HTTP 404") do
        next_build_uri = double
        next_build_uri.stub(:open) do
          raise OpenURI::HTTPError.new("404 Not Found", StringIO.new)
        end
        URI.stub(:parse).with("http://test.host:1234/job/test.build/7/api/xml").and_return(next_build_uri)

        runtime_info = subject.fetch_build_info(JenkinsServerSettings.new("test.host", 1234, "test.build"))

        runtime_info.status.should == 0
      end
      it("should return current build status as 1 when requesting next build info returns data") do
        next_build_uri = double
        next_build_uri.stub(:open) do
          StringIO.new "<test></test>"
        end
        URI.stub(:parse).with("http://test.host:1234/job/test.build/7/api/xml").and_return(next_build_uri)

        runtime_info = subject.fetch_build_info(JenkinsServerSettings.new("test.host", 1234, "test.build"))

        runtime_info.status.should == 1
      end
      it("should return current build status as nil when requesting next build info fails") do
        next_build_uri = double
        next_build_uri.stub(:open) do
          raise "Generic Error"
        end
        URI.stub(:parse).with("http://test.host:1234/job/test.build/7/api/xml").and_return(next_build_uri)

        runtime_info = subject.fetch_build_info(JenkinsServerSettings.new("test.host", 1234, "test.build"))

        runtime_info.status.should be_nil
      end
    end
  end
end
